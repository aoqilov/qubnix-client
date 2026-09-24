// Kod ichida `t()` ga o'ralmay qolgan foydalanuvchiga ko'rinadigan matnlarni topadi.
// Ishlatish: npm run i18n:check  (yoki: node scripts/i18n-check.mjs <papka> ...)
//
// Topadi:
//   1) JSX matni:            <span>Сохранить</span>
//   2) Matnli JSX atributlar: label="..." title="..." placeholder="..." ...
//   3) Obyektdagi matnli maydonlar: { label: "...", title: "..." }
//   4) Kirill yoki o'zbekcha belgili har qanday satr (import/tip emas).
// Istisno: satr oxirida `// i18n-ignore` izohi bo'lsa.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const DEFAULT_ROOTS = [
  "src/widgets/features/mobile",
  "src/widgets/features/login",
  "src/components/shared",
  "src/components/layout/mobile",
  "src/components/layout/enter-way",
  "src/components/ui",
  "src/components/ui-custom",
  "src/utils",
  "src/pages/NotFound.tsx",
];

const TEXT_PROPS = new Set([
  "label", "title", "subtitle", "description", "placeholder", "hint", "message",
  "text", "emptyText", "buttonText", "loadingText", "modalTitle", "statusLabel",
  "filterLabel", "completedLabel", "aria-label", "alt", "confirmText", "cancelText",
  "errorText", "helperText", "tooltip", "header", "caption", "ariaLabel",
]);

const CYRILLIC = /[А-Яа-яЁёЎўҚқҒғҲҳ]/;
// O'zbekcha belgilar: o'/g' tutuq belgisi bilan (kod identifikatorida uchramaydi).
const UZBEK = /[A-Za-z][oOgG]['‘’ʻ][a-z]|\b[oOgG]['‘’ʻ][a-z]/;
const HAS_LETTER = /\p{L}/u;
// Matn emas: CSS qiymatlari va texnik identifikatorlar (var(--x), "preview", "text-sm").
const NOT_TEXT = /^(var\(|#[0-9a-f]{3,8}$|[a-z0-9_\-./:#%()]+$)/;
// Bosh harfli so'z/ibora ("Bugunlik", "Kelajak kunlari") — apostrofsiz o'zbekcha yoki
// inglizcha matn ham tutilsin. className'lar kichik harfli, shuning uchun tushmaydi.
const CAPITALIZED_PHRASE = /^[A-Z][a-z'‘’ʻ]+(?:[ -][A-Za-z'‘’ʻ]+)*[.!?…:]*$/;
// Texnik bosh harfli qiymatlar (HTTP sarlavhalar, timezone, event nomlari).
const TECHNICAL = new Set(["Asia", "Content-Type", "Authorization", "Bearer", "Escape", "Enter", "Tab", "Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

const roots = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROOTS;

function collectFiles(target) {
  if (!fs.existsSync(target)) return [];
  if (fs.statSync(target).isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    return /\.(tsx?|mts)$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [full] : [];
  });
}

function isInsideImportOrType(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (
      ts.isImportDeclaration(p) ||
      ts.isExportDeclaration(p) ||
      ts.isTypeNode(p) ||
      ts.isLiteralTypeNode(p)
    ) {
      return true;
    }
  }
  return false;
}

/** Matn bo'lmagan kontekst: className, key, type, switch case, === taqqoslash. */
function isNonTextContext(node) {
  const parent = node.parent;
  if (ts.isJsxAttribute(parent) || (ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent))) {
    const attr = ts.isJsxAttribute(parent) ? parent : parent.parent;
    return !TEXT_PROPS.has(attr.name.getText());
  }
  if (ts.isCaseClause(parent) || ts.isElementAccessExpression(parent)) return true;
  if (ts.isBinaryExpression(parent)) return true;
  if (ts.isPropertyAssignment(parent) && parent.name === node) return true;
  return false;
}

/** Satr `t("...")` yoki `i18n.t("...")` chaqiruvining argumentimi (kalit — matn emas). */
function isTranslationKey(node) {
  const call = node.parent;
  if (!call || !ts.isCallExpression(call)) return false;
  const callee = call.expression;
  const name = ts.isIdentifier(callee)
    ? callee.text
    : ts.isPropertyAccessExpression(callee)
      ? callee.name.text
      : "";
  return name === "t" || name === "Trans";
}

const findings = [];

for (const root of roots) {
  for (const file of collectFiles(root)) {
    const sourceText = fs.readFileSync(file, "utf8");
    const lines = sourceText.split(/\r?\n/);
    const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    const report = (node, text, kind) => {
      const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
      if (/i18n-ignore/.test(lines[line] ?? "")) return;
      findings.push({ file: file.replace(/\\/g, "/"), line: line + 1, kind, text: text.trim().slice(0, 70) });
    };

    const visit = (node) => {
      if (ts.isJsxText(node)) {
        const text = node.getText(source);
        if (HAS_LETTER.test(text) && text.trim()) report(node, text, "jsx-text");
      } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const text = node.text;
        const parent = node.parent;
        if (
          !HAS_LETTER.test(text) ||
          NOT_TEXT.test(text) ||
          isInsideImportOrType(node) ||
          isTranslationKey(node)
        ) {
          // skip
        } else if (ts.isJsxAttribute(parent) && TEXT_PROPS.has(parent.name.getText(source))) {
          report(node, text, `attr:${parent.name.getText(source)}`);
        } else if (
          ts.isJsxExpression(parent) &&
          ts.isJsxAttribute(parent.parent) &&
          TEXT_PROPS.has(parent.parent.name.getText(source))
        ) {
          report(node, text, `attr:${parent.parent.name.getText(source)}`);
        } else if (
          ts.isPropertyAssignment(parent) &&
          parent.initializer === node &&
          TEXT_PROPS.has(parent.name.getText(source).replace(/["']/g, ""))
        ) {
          report(node, text, `prop:${parent.name.getText(source)}`);
        } else if (CYRILLIC.test(text) || UZBEK.test(text)) {
          report(node, text, "string");
        } else if (CAPITALIZED_PHRASE.test(text) && !TECHNICAL.has(text) && !isNonTextContext(node)) {
          report(node, text, "maybe-text");
        }
      } else if (ts.isTemplateExpression(node)) {
        const raw = node.getText(source);
        if (CYRILLIC.test(raw) || UZBEK.test(raw)) report(node, raw, "template");
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}

if (findings.length === 0) {
  console.log("i18n:check — tarjima qilinmagan matn topilmadi ✓");
  process.exit(0);
}

const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}
for (const [file, items] of byFile) {
  console.log(`\n${file} (${items.length})`);
  for (const item of items) console.log(`  ${String(item.line).padStart(4)}  ${item.kind.padEnd(18)} ${item.text}`);
}
console.log(`\nJami: ${findings.length} ta matn, ${byFile.size} ta fayl.`);
process.exit(1);

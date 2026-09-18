import {
  LuCrown,
  LuShieldCheck,
  LuUser,
  LuEye,
  LuFolderKanban,
  LuSquareCheck,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import type { CusAccordionItem } from "@/components/ui/accordion/CusAccordion";

// Tashkilot (workspace) darajasidagi rollar — const/roles.ts dagi WORKSPACE_ROLES bilan mos.
export const ORGANIZATION_ROLE_ITEMS: CusAccordionItem[] = [
  {
    value: "owner",
    title: "Владелец",
    icon: <LuCrown size={18} />,
    badge: (
      <CusBadge variant="subtle" tone="brand">
        Полный доступ
      </CusBadge>
    ),
    content:
      "Полный контроль над workspace: тариф и оплата, сотрудники, роли, проекты — включая удаление самой организации.",
  },
  {
    value: "admin",
    title: "Админ",
    icon: <LuShieldCheck size={18} />,
    badge: (
      <CusBadge variant="subtle" tone="info">
        Почти всё
      </CusBadge>
    ),
    content:
      "Управляет всем внутри workspace — сотрудники, роли, проекты, задачи. Не может только удалить саму организацию.",
  },
  {
    value: "member",
    title: "Сотрудник",
    icon: <LuUser size={18} />,
    content:
      "Обычный сотрудник организации. Видит и выполняет задачи, назначенные ему в проектах, где он участвует.",
  },
  {
    value: "viewer",
    title: "Наблюдатель",
    icon: <LuEye size={18} />,
    badge: (
      <CusBadge variant="subtle" tone="neutral">
        Только просмотр
      </CusBadge>
    ),
    content:
      "Видит всё то же, что и админ, но без права что-либо менять — никаких действий, только просмотр.",
  },
];

// Loyiha darajasidagi rollar — const/roles.ts dagi PROJECT_ROLES bilan mos.
export const PROJECT_ROLE_ITEMS: CusAccordionItem[] = [
  {
    value: "project_manager",
    title: "Менеджер проекта",
    icon: <LuFolderKanban size={18} />,
    badge: (
      <CusBadge variant="subtle" tone="info">
        В своих проектах
      </CusBadge>
    ),
    content:
      "Назначается на конкретный проект (или несколько). Может создавать, редактировать и удалять задачи — но только в своих проектах.",
  },
  {
    value: "project_member",
    title: "Участник проекта",
    icon: <LuSquareCheck size={18} />,
    badge: (
      <CusBadge variant="subtle" tone="neutral">
        Исполнитель
      </CusBadge>
    ),
    content:
      "Только исполнитель — выполняет задачи, назначенные ему в проекте. Не может создавать или удалять задачи.",
  },
];

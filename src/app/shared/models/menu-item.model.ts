export interface MenuItem {
  styleClass?: string;
  icon?: string;
  label: string;
  onClick: () => void;
}

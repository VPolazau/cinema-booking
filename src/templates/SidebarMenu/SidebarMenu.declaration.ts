export interface ISidebarMenu {
    isAuthed: boolean;
    onAfterNavigate?: () => void;
    title?: string;
}
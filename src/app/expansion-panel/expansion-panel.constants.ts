export type ExpansionPanelConfig = {
  readonly startsExpanded: boolean;
  readonly buttonStyles: string;
  readonly contentContainerStyles: string;
};

export const defaultConfig: ExpansionPanelConfig = {
  startsExpanded: true,
  buttonStyles: 'material-icons-outlined tce-text tce-text-slate-600 hover:tce-bg-slate-200 hover:tce-rounded',
  contentContainerStyles: '',
};

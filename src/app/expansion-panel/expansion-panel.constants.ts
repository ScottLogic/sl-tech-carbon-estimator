export type ExpansionPanelConfig = {
  startsExpanded: boolean;
  buttonStyles: string;
  contentContainerStyles: string;
};

export const defaultConfig: ExpansionPanelConfig = {
  startsExpanded: true,
  buttonStyles: 'material-icons-outlined tce-text tce-text-slate-600 hover:tce-bg-slate-200 hover:tce-rounded',
  contentContainerStyles: '',
};

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

export const questionPanelConfig: ExpansionPanelConfig = {
  startsExpanded: false,
  buttonStyles: 'material-icons-outlined tce-text-base tce-text-slate-600 hover:tce-bg-slate-200 hover:tce-rounded',
  contentContainerStyles: 'tce-px-3 tce-py-2 tce-bg-slate-100 tce-border tce-border-slate-400 tce-rounded tce-text-sm',
};

export type ExpansionPanelConfig = {
  readonly startsExpanded: boolean;
  readonly buttonStyles: string;
  readonly contentContainerStyles: string;
};

export const defaultConfig: ExpansionPanelConfig = {
  startsExpanded: true,
  buttonStyles: 'material-icons-outlined tce:text tce:hover:bg-slate-200 tce:hover:rounded',
  contentContainerStyles: '',
};

export type ExpansionPanelButtonConfig = {
  expandedIcon: string;
  collapsedIcon: string;
  classAttribute: string;
};

export const defaultButtonConfig: ExpansionPanelButtonConfig = {
  expandedIcon: 'expand_less',
  collapsedIcon: 'expand_more',
  classAttribute: 'material-icons-outlined tce-text tce-text-slate-600 hover:tce-bg-slate-200 hover:tce-rounded',
};

export const helperButtonConfig: ExpansionPanelButtonConfig = {
  expandedIcon: 'help_outline',
  collapsedIcon: 'help_outline',
  classAttribute: 'material-icons-outlined tce-text-base tce-text-slate-600 hover:tce-bg-slate-300 tce-rounded',
};

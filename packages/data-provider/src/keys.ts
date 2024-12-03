export enum QueryKeys {
  messages = 'messages',
  sharedMessages = 'sharedMessages',
  sharedLinks = 'sharedLinks',
  allConversations = 'allConversations',
  archivedConversations = 'archivedConversations',
  searchConversations = 'searchConversations',
  conversation = 'conversation',
  searchEnabled = 'searchEnabled',
  user = 'user',
  users = 'users',
  name = 'name', // user key name
  models = 'models',
  balance = 'balance',
  endpoints = 'endpoints',
  presets = 'presets',
  searchResults = 'searchResults',
  tokenCount = 'tokenCount',
  availablePlugins = 'availablePlugins',
  startupConfig = 'startupConfig',
  assistants = 'assistants',
  assistant = 'assistant',
  agents = 'agents',
  agent = 'agent',
  endpointsConfigOverride = 'endpointsConfigOverride',
  files = 'files',
  fileConfig = 'fileConfig',
  tools = 'tools',
  toolAuth = 'toolAuth',
  agentTools = 'agentTools',
  actions = 'actions',
  assistantDocs = 'assistantDocs',
  agentDocs = 'agentDocs',
  fileDownload = 'fileDownload',
  voices = 'voices',
  customConfigSpeech = 'customConfigSpeech',
  prompts = 'prompts',
  prompt = 'prompt',
  promptGroups = 'promptGroups',
  allPromptGroups = 'allPromptGroups',
  promptGroup = 'promptGroup',
  categories = 'categories',
  randomPrompts = 'randomPrompts',
  roles = 'roles',
  conversationTags = 'conversationTags',
  health = 'health',
  userTerms = 'userTerms',
  banner = 'banner',
}

export enum MutationKeys {
  fileUpload = 'fileUpload',
  fileDelete = 'fileDelete',
  userUpload = 'userUpload',
  usersUpload = 'usersUpload',
  userDelete = 'userDelete',
  usersDelete = 'usersDelete',
  updatePreset = 'updatePreset',
  deletePreset = 'deletePreset',
  logoutUser = 'logoutUser',
  avatarUpload = 'avatarUpload',
  speechToText = 'speechToText',
  textToSpeech = 'textToSpeech',
  assistantAvatarUpload = 'assistantAvatarUpload',
  agentAvatarUpload = 'agentAvatarUpload',
  updateAction = 'updateAction',
  updateAgentAction = 'updateAgentAction',
  deleteAction = 'deleteAction',
  deleteAgentAction = 'deleteAgentAction',
  deleteUser = 'deleteUser',
  deleteUsers = 'usersDelete',
  addUsers = 'usersAdd',
  updateRole = 'updateRole',
}

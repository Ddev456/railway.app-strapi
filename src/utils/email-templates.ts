import welcomeTemplate from '../email-templates/welcome';

export const getWelcomeEmailTemplate = (user) => {
  const compile = (template: string) => {
    return template.replace(/<%=\s*user\.(\w+)\s*%>/g, (_, key) => user[key] || '');
  };

  return {
    text: compile(welcomeTemplate.text),
    html: compile(welcomeTemplate.html),
  };
};
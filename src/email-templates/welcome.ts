export default {
    subject: 'Bienvenue sur Carnet Potager !',
    text: `
      Bonjour <%= user.username %>,
      
      Nous sommes ravis de vous accueillir sur Carnet Potager !
      
      Cette application est pour le moment un prototype, n'hésitez pas à nous faire vos retours 😊

      Vous pouvez dès maintenant commencer à utiliser l'application pour gérer votre potager.
      
      À bientôt,
      L'équipe Carnet Potager
    `,
    html: `
      <h1>Bienvenue sur Carnet Potager !</h1>
      
      <p>Bonjour <%= user.username %>,</p>
      
      <p>Nous sommes ravis de vous accueillir sur Carnet Potager !</p>

      <p>Cette application est pour le moment un prototype, n'hésitez pas à nous faire vos retours 😊</p>
      
      <p>Vous pouvez dès maintenant commencer à utiliser l'application pour gérer votre potager.</p>
      
      <p>À bientôt,<br>L'équipe Carnet Potager</p>
    `,
  };
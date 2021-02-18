//Calling Master Layout
Router.configure({
    layoutTemplate: 'ApplicationLayout'
  });
  //////////////////////
  
  
  //Routing to different templates
  
  /////////Home Page///////////////
  Router.route('/', function () {
    this.render('navigation_bar',   {to: "navbar"} );
    this.render('FORMS',            {to: "main"});
  });
  
 
  ///////Leaderboard////////////
  Router.route('/Leaderboard', function () {
    this.render('navigation_bar',   {to: "navbar"} );	
    this.render('leaderboard'	, {to: "main"});
      
  });

  ///////Leaderboard////////////
  Router.route('/Profile', function () {
    this.render('navigation_bar',   {to: "navbar"} );	
    this.render('profile'	, {to: "main"});
      
  });
   /*
  ///////Tutorials////////////////
  Router.route('/Tutorials', function () {
      this.render('navi'				, {to: "navbar"});	
      this.render('tutorials'	, {to: "main"});
      
  });
  
  Router.route('/Profile', function () {
      this.render('navi'				, {to: "navbar"});	
      this.render('profile'	, {to: "main"});
      
  });
  */
  
  
  ////////////////////////////////
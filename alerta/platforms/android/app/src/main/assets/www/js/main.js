document.addEventListener("deviceReady", onDeviceReady, false);

function onDeviceReady()
{  

/* 

  function muda(){
      $('.login-page').css("display", "none");
      $('.home-page').css("display", "block");
      $('.loading').css("display", "none");
      $('.success').css("display", "none");
      $('body').css("background-color", "white");
  

      navigator.geolocation.getCurrentPosition(function(pos){

        navigator.notification.alert
        (
            "Latitude: " +pos.coords.latitude+ ", Longitude: " +pos.coords.longitude,
            null,
            "Latitude e Longitude",
            'OK'
        );


      });
  }



  $(".login-button").click(muda);

  function enviar(){
      $('.login-page').css("display", "none");
      $('.home-page').css("display", "none");
      $('.loading').css("display", "flex");
      $('.success').css("display", "none");
  }

  $(".category").click(enviar);




*/



  const loginButton = document.getElementById('login-button');
  const loginPage = document.getElementById('login-page');
  const loginInput = document.getElementById('login');
  const senhaInput = document.getElementById('senha');


  const homePage = document.getElementById('home-page');
  const categories = document.querySelectorAll(".category");


  const loadingPage = document.getElementById('loading');
  const successPage = document.getElementById('success');
  const successButton = document.getElementById('success-button');

  var lat;
  var lng;

  navigator.geolocation.getCurrentPosition(function(pos){

    lat = pos.coords.latitude;
    lng = pos.coords.longitude;

  });

  loginButton.addEventListener('click', function () 
  {
    cordovaFetch('http://paradigmas.hol.es/web/usuario/login', {method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          login: loginInput.value,
          senha: senhaInput.value
        }),
        })
        .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            console.log(response);
            navigator.notification.alert
            (
                "Login ou Senha inválidos",
                null,
                "Erro!",
                'OK'
            );
            throw new Error(response.statusText);
          }
        }).then( function(response){
            console.log(response);
/*            
            navigator.notification.alert
            (
                response,
                null,
                "Response",
                'OK'
            );
*/
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('nome_usuario', response.nome);
            localStorage.setItem('id_usuario', response.id);
            loginPage.style.display = "none";
            homePage.style.display = "block";
            loadingPage.style.display = "none";
            successPage.style.display = "none";
          });
  });

  for(var i=0; i<categories.length; i++)
  {
    categories[i].addEventListener('click', function () {
      console.log(this.id);
      console.log(localStorage.getItem("access_token"));
      
      loginPage.style.display = "none";
      homePage.style.display = "none";
      loadingPage.style.display = "flex";
      successPage.style.display = "none";

      cordovaFetch('http://paradigmas.hol.es/web/alerta', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' :  'Basic ' + btoa(localStorage.getItem("access_token") + ':')
        },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            categoria_id: this.id,
          }),
          })
          .then(function(response) {
            if (response.ok) 
            {
              return response.json();
            } 
            else 
            {
              console.log(response);
              
              throw new Error(response.statusText);
            }
          }).then( function(response){
              console.log(response);
              loginPage.style.display = "none";
              homePage.style.display = "none";
              
              setTimeout(function(){loadingPage.style.display = "none";successPage.style.display = "flex";}, 3000);
              
            });
    });

  };


  successButton.addEventListener('click', function () {
    loginPage.style.display = "none";
    homePage.style.display = "block";
    loadingPage.style.display = "none";
    successPage.style.display = "none";
  });



};

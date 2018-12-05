/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');

        app.tela();


//        setTimeout(app.teste, 5000);

        app.conexao();
        app.gps();

    },

    tela: function(){
        screen.orientation.lock('portrait');

        //Teclado
        if(/Android/.test(navigator.appVersion)) {
           window.addEventListener("resize", function() {
             if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
               document.activeElement.scrollIntoView();
             }
          })
        }

    },

    // Update DOM on a Received Event
    teste: function() {
        navigator.notification.alert
        (
            "Teste",
            null,
            "Foi!",
            'OK'
        );
    },

    conexao: function()
    {
        var rede = navigator.connection.type;
/*        
        navigator.notification.alert
        (
            rede,
            null,
            "Rede",
            'OK'
        );
*/
        if(rede == Connection.NONE || rede == Connection.UNKNOWN)
        {
            navigator.notification.alert
            (
                "O aplicativo necessita de internet. Verifique a conexão.",
                null,
                "Rede",
                'OK'
            );
        }     
    },

    gps: function() {
        //$('.login-page').css("display", "none");
    
        cordova.plugins.locationAccuracy.canRequest
        (
            function(canRequest)
            {
                if(canRequest)
                {
                    cordova.plugins.locationAccuracy.request
                    (
                        function (success)
                        {
                            console.log("Successfully requested accuracy: "+success.message);
/*
                            navigator.notification.alert
                            (
                                "Sucesso: "+success.message,
                                null,
                                "Estava ativada",
                                'OK'
                            );
*/
                        }, 
                        function (error)
                        {
                            console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
/*                       
                            navigator.notification.alert
                            (
                                "Accuracy request failed: error code="+error.code+"; error message="+error.message,
                                null,
                                "A localização estava desativada",
                                'OK'
                            );
*/
                            if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED)
                            {
                                if(window.confirm("Quer ativar a localização manualmente?"))
                                {
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                }
                            }
                        }, 
                        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
                    );
                }
                else
                {
                    // request location permission and try again
                }
            }
        );
    }

     
};

app.initialize();
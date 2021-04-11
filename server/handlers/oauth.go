package handlers

import (
	"encoding/json"
	"fmt"

	"github.com/cdkini/recurse-connect/server/config"

	"log"
	"net/http"
	"net/url"
)

func Login(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := env.Store.Get(r, "session")
		_, ok := session.Values["userId"]
		if ok {
			url := fmt.Sprintf(
				"%s?response_type=code&client_id=%s&client_secret=%s&redirect_uri=%s",
				env.Vars.AuthorizeURL, env.Vars.ClientId, env.Vars.ClientSecret, env.Vars.RedirectURL)

			// Redirect to hit auth endpoint (api/v1/auth)
			http.Redirect(w, r, url, http.StatusTemporaryRedirect)
		}
	})
}

func Auth(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// GET to obtain authorization code
		err := r.ParseForm()
		if err != nil {
			log.Fatalln("Could not parse user authorization code from response: ", err)
		}
		authCode := r.Form.Get("code")

		// POST to obtain access token
		formData := url.Values{
			"grant_type":    {"authorization_code"},
			"redirect_uri":  {env.Vars.RedirectURL},
			"code":          {authCode},
			"client_id":     {env.Vars.ClientId},
			"client_secret": {env.Vars.ClientSecret},
		}

		resp, err := http.PostForm(env.Vars.AccessTokenURL, formData)
		if err != nil {
			log.Fatalln("Error occured when sending POST to Recurse API for auth: ", err)
		}
		defer resp.Body.Close()

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		accessToken := result["access_token"].(string)

		addSession(w, r, env, accessToken)

		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	})
}

func Whoami(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := env.Store.Get(r, "session")
		userId, ok := session.Values["userId"]
		if !ok {
			http.Error(w, "Could not find user session", http.StatusNoContent)
			return
		}
		json.NewEncoder(w).Encode(userId)
	})
}

func addSession(w http.ResponseWriter, r *http.Request, env *config.Env, accessToken string) int {
	url := fmt.Sprintf("%speople/me?access_token=%s", env.Vars.APIBaseURL, accessToken)

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln("Could not identify the user: ", err)
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	userId := int(result["id"].(float64))
	session, _ := env.Store.Get(r, "session")
	session.Values["userId"] = userId
	session.Save(r, w)

	return userId
}

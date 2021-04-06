package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

var accessToken string
var authCode string

var err = godotenv.Load(".env")
var (
	accessTokenURL = os.Getenv("ACCESS_TOKEN_URL")
	apiBaseURL     = os.Getenv("API_BASE_URL")
	authorizeURL   = os.Getenv("AUTHORIZE_URL")
	clientId       = os.Getenv("CLIENT_ID")
	clientSecret   = os.Getenv("CLIENT_SECRET")
	redirectURL    = os.Getenv("REDIRECT_URL")
)

func Login(w http.ResponseWriter, r *http.Request) {
	url := fmt.Sprintf(
		"%s?response_type=code&client_id=%s&client_secret=%s&redirect_uri=%s",
		authorizeURL, clientId, clientSecret, redirectURL)

	// Redirect to hit auth endpoint (api/v1/auth)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func Auth(w http.ResponseWriter, r *http.Request) {
	// GET to obtain authorization code
	err := r.ParseForm()
	if err != nil {
		log.Fatalln("Could not parse user authorization code from response: ", err)
	}
	authCode = r.Form.Get("code")

	// POST to obtain access token
	formData := url.Values{
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {redirectURL},
		"code":          {authCode},
		"client_id":     {clientId},
		"client_secret": {clientSecret},
	}

	resp, err := http.PostForm(accessTokenURL, formData)
	if err != nil {
		log.Fatalln("Error occured when sending POST to Recurse API for auth: ", err)
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	accessToken = result["access_token"].(string)

	whoami()
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func whoami() {
	url := fmt.Sprintf("%speople/me?access_token=%s", apiBaseURL, accessToken)
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln("Could not identify the user: ", err)
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln("Could not read HTTP response: ", err)
	}

	fmt.Println(string(bytes))
}

// curl https://www.hackerschool.com/api/v1/people/me?access_token=<access_token_from_step_4>

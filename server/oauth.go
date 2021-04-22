package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/pkg/errors"
)

// GET api/v1/login
func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
	session, _ := s.Store.Get(r, "session")
	if _, ok := session.Values["userId"]; !ok {
		url := fmt.Sprintf(
			"%s?response_type=code&client_id=%s&client_secret=%s&redirect_uri=%s",
			os.Getenv("AUTHORIZE_URL"), os.Getenv("CLIENT_ID"), os.Getenv("CLIENT_SECRET"), os.Getenv("REDIRECT_URL"))

		// Redirect to hit auth endpoint (api/v1/auth)
		s.Logger.Println("User session not found; redirecting to /auth for OAuth2 authentication")
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)

	} else {
		s.Logger.Println("User already authenticated; skipping OAuth2 authentication")
	}
}

// Handler responsible for authenticating users from login redirect.
// This endpoint should only be accessed through the redirect. As such, it needs to be a Server receiver method
// to ensure that it has access to the cookie store. // TODO: Is there a cleaner way to do this?
func (s *Server) Auth(w http.ResponseWriter, r *http.Request) {
	// GET to obtain authorization code
	if err := r.ParseForm(); err != nil {
		s.Logger.Printf("Could not successfully parse form: %v\n", err)
		http.Error(w, "Could not authenticate with the Recurse API", http.StatusInternalServerError)
		return
	}
	authCode := r.Form.Get("code")

	// POST to obtain access token
	formData := url.Values{
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {os.Getenv("REDIRECT_URL")},
		"code":          {authCode},
		"client_id":     {os.Getenv("CLIENT_ID")},
		"client_secret": {os.Getenv("CLIENT_SECRET")},
	}

	resp, err := http.PostForm(os.Getenv("ACCESS_TOKEN_URL"), formData)
	if err != nil {
		s.Logger.Printf("Could not successfully post form: %v\n", err)
		http.Error(w, "Could not authenticate with the Recurse API", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	accessToken := result["access_token"].(string)

	// Use access token to create user session and redirect back to root
	err = s.addSession(w, r, accessToken)
	if err != nil {
		s.Logger.Printf("Something went wrong when creating a session: %v\n", err)
		http.Error(w, "Error occurred when creating user session", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func (s *Server) addSession(w http.ResponseWriter, r *http.Request, accessToken string) error {
	url := fmt.Sprintf("%speople/me?access_token=%s", os.Getenv("API_BASE_URL"), accessToken)

	// GET request to Recurse API to identify user
	resp, err := http.Get(url)
	if err != nil {
		s.Logger.Printf("Did not get a successful response back from Recurse API: %v\n", err)
		return errors.Wrap(err, "Issue authenticating user through Recurse API")
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	// Access cookie store for session mgmt
	userId := int(result["id"].(float64))
	name := result["name"]
	session, err := s.Store.Get(r, "session")
	if err != nil {
		s.Logger.Printf("Could not successfully create new session: %v\n", err)
		return errors.Wrap(err, "Cookie could not be established for user session")
	}

	// Save user session
	session.Values["userId"] = userId
	session.Values["name"] = name
	session.Save(r, w)
	s.Logger.Printf("Saved user %v session in cookie store\n", userId)

	return nil
}

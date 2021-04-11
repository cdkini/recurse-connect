package types

import (
	"encoding/json"
	"github.com/go-playground/validator"
	"io"
)

type Note struct {
	Id      int    `json:"id" validate:"numeric"`
	Author  string `json:"author" validate:"required,alpha"`
	Title   string `json:"title" validate:"required,alpha"`
	Date    string `json:"date" validate:"required,datetime"`
	Content string `json:"content" validate:"required,json"`
}

type Notes []*Note

func (n *Note) FromJSON(r io.Reader) error {
	return json.NewDecoder(r).Decode(n)
}

func (n *Note) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(n)
}

func (n *Notes) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(n)
}

func (n *Note) Validate() error {
	validate := validator.New()
	return validate.Struct(n)
}

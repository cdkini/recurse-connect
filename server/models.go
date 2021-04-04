package server

// import (
// 	"database/sql"
// 	"errors"
// )

type Profile struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	ProfilePath string `json:"profile_path"`
	ImagePath   string `json:"image_path"`
	LocationId  string `json:"location_id"`
	CompanyId   string `json:"company_id"`
	Bio         string `json:"bio"`
	Interests   string `json:"interests"`
	BeforeRc    string `json:"before_rc"`
	DuringRc    string `json:"during_rc"`
	Email       string `json:"email"`
	GitHub      string `json:"github"`
	Twitter     string `json:"twitter"`
}

type Location struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Batch struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	ShortName string `json:"short_name"`
}

type Stint struct {
	Id int `json:"id"`
	// StartDate
}

// class Stint(db.Model, Serializer):
//     id = db.Column(db.Integer, primary_key=True)
//     start_date = db.Column(db.DateTime)
//     end_date = db.Column(db.DateTime)
//     batch_id = db.Column(db.Integer, db.ForeignKey("batch.id"))
//     profile_id = db.Column(db.Integer, db.ForeignKey("profile.id"))

//     def __repr__(self):
//         return str(self.__dict__)

type Company struct {
}

// class Company(db.Model, Serializer):
//     id = db.Column(db.Integer, primary_key=True)
//     name = db.Column(db.String(64))

//     def __repr__(self):
//         return str(self.__dict__)

type Note struct {
}

// class Note(db.Model, Serializer):
//     id = db.Column(db.Integer, primary_key=True)
//     author = db.Column(db.Integer, db.ForeignKey("profile.id"))
//     title = db.Column(db.String(128))
//     date = db.Column(db.String(128))
//     content = db.Column(db.JSON)

//     def __repr__(self):
//         return str(self.__dict__)

type Tag struct {
}

// # What tags are associated with a given note? Who is associated with a tag?
// class Tag(db.Model, Serializer):
//     id = db.Column(db.Integer, primary_key=True)
//     author = db.Column(db.Integer, db.ForeignKey("profile.id"))
//     name = db.Column(db.String(64))
//     participant = db.Column(db.Integer, db.ForeignKey("profile.id"))
//     note_id = db.Column(db.Integer, db.ForeignKey("note.id"))

//     def __repr__(self):
//         return str(self.__dict__)

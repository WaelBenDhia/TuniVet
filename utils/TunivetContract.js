function PatientsEntry(){}
PatientsEntry.TABLE_NAME         = "patients";
PatientsEntry.ID                 = "id";
PatientsEntry.NAME               = "name";
PatientsEntry.ENTRY_DATE         = "entry_date";
PatientsEntry.EXIT_DATE          = "exit_date";
PatientsEntry.UPDATE_DATE        = "update_date";
PatientsEntry.CONDITION          = "condition";

function ArticlesEntry(){}
ArticlesEntry.TABLE_NAME         = "articles";
ArticlesEntry.ID                 = "id";
ArticlesEntry.NAME               = "name";
ArticlesEntry.AUTHOR             = "author";
ArticlesEntry.WRITE_DATE         = "write_date";
ArticlesEntry.LAST_UPDATE_DATE   = "last_update_date";
ArticlesEntry.CONTENT            = "content";

function BackgroundImagesEntry(){}
BackgroundImagesEntry.TABLE_NAME = "backgrounds_images";
BackgroundImagesEntry.ID         = "id";
BackgroundImagesEntry.IMAGE_DATA = "image_data";

function UsersEntry(){}
UsersEntry.TABLE_NAME            = "users";
UsersEntry.USERNAME              = "username";
UsersEntry.EMAIL                 = "email";
UsersEntry.FIRST_NAME            = "first_name";
UsersEntry.LAST_NAME             = "last_name";
UsersEntry.PASSWORD              = "password";
UsersEntry.SALT                  = "salt";

function LandingPageInfoEntry(){}
LandingPageInfoEntry.TABLE_NAME  = "landing_page_info";
LandingPageInfoEntry.ID          = "id";
LandingPageInfoEntry.TITLE       = "title";
LandingPageInfoEntry.BODY        = "body";

module.exports = {
	PatientsEntry: PatientsEntry,
	ArticlesEntry: ArticlesEntry,
	BackgroundImagesEntry: BackgroundImagesEntry,
	UsersEntry: UsersEntry,
	LandingPageInfoEntry: LandingPageInfoEntry
};
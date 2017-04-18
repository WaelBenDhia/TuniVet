"use strict";

const PatientsEntry = {
	TABLE_NAME: "patients",
	ID: "id",
	NAME: "name",
	ENTRY_DATE: "entry_date",
	EXIT_DATE: "exit_date",
	UPDATE_DATE: "update_date",
	CONDITION: "condition",
	TARIF: "tarif"
};

const ArticlesEntry = {
	TABLE_NAME: "articles",
	ID: "id",
	NAME: "name",
	AUTHOR: "author",
	WRITE_DATE: "write_date",
	LAST_UPDATE_DATE: "last_update_date",
	CONTENT: "content"
};

const UsersEntry = {
	TABLE_NAME: "users",
	USERNAME: "username",
	EMAIL: "email",
	FIRST_NAME: "first_name",
	LAST_NAME: "last_name",
	PASSWORD: "password",
	SALT: "salt"
};

const LandingPageInfoEntry = {
	TABLE_NAME: "landing_page_info",
	ID: "id",
	TITLE: "title",
	BODY: "body"
};

module.exports = {
	PatientsEntry: PatientsEntry,
	ArticlesEntry: ArticlesEntry,
	UsersEntry: UsersEntry,
	LandingPageInfoEntry: LandingPageInfoEntry
};
CREATE TABLE elefrey_services.user (
	user_id uuid,
	user_firstname text,
	user_lastname text,
	user_password text,
	user_phone text,
	user_address text,
    user_identification text, 
    user_email text,
	PRIMARY KEY (user_id)
);

CREATE TABLE elefrey_services.material (
	mat_id uuid,
	mat_name text,
	mat_unidades text,
	mat_unit_measure text,
	mat_description text,
	mat_image text,
	PRIMARY KEY (mat_id)
);


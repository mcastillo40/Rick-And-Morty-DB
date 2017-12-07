# Rick-And-Morty-DB

The project is based on the 'Rick and Morty' show as well as with the game released 'Pocket Mortys'

The user will be introduced to a form that allows them to enter a Rick’s information, this includes their first name (the last name will always be Rick), level, type, and dimension. The user will also have the option of choosing a Morty that has already been created or will be able to create their own morty to capture. As in the game a rick is only allowed to start off with a single morty. After he is created then the user may update the Rick to add or remove multiple mortys.
A morty’s last name will also not be able to be manipulated in order to distinguish which is a ‘morty’ character. A morty will be able to have different types of attacks which the user may manipulate. Same as Rick when creating a morty only 1 attack type may be chosen because he is just starting off. After created you may update him as you please.

Database Outline:

rick entity will have:
	
	id (Primary key),
	first name: User will be able to manipulate (Must be entered)
	last name: User cannot manipulate, always will be 'Rick' to show that it is a
		Rick character	
	level: Integer that user may manipulate can be NULL
	type: Will be a reference to type table; May only be of 1 type
	dimension: Will be a reference to universe table; May only be of 1 type. 

Universe will have: 
		
	id (Primary key) 
	name: Name of the universe
	population: Number of people in the universe
	species: Name of species

rick_type will have: 
		
	id (Primary key)
	type: Cannot be NULL for either attribute; This is a type that a Rick can be. 
	There were only 2 types of ricks available for the user to select.

morty entity will have:

	id (Primary key),
	first name: User will be able to manipulate (Must be entered)
	last name: User cannot manipulate, always will be 'Morty' to show that it is a Morty character
	level: Integer that user may manipulate can be NULL
	health: Integer that user may manipulate can be NULL
	defense: Integer that user may manipulate can be NULL

attack_type will have an id (Primary key)
	
	ability: Name of the attack that must be listed
	power: Integer of the attack power, can be NULL

Relationships:

	Ricks are from dimensions – they can only be from 1 dimension. This is a 1
	to many relationship

	Ricks are a certain type – they can only be of 1 type. This is a 1 to many
	relationship.

	Ricks can capture/use different Mortys – This is a many-to-many relationship
	where a Rick can own many Mortys.
	
	Mortys have attacks – this is considered a many-to-many relationship.
	Morty’s can have multiple attacks of different abilities.

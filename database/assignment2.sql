-- Insert a new account
INSERT INTO account 
    (account_firstname, account_lastname, account_email, account_password)
VALUES
    ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the account type to 'Admin' for the newly created account
UPDATE
    account SET account_type = 'Admin'
WHERE
    account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Deleting the Tony Stark record from database
DELETE FROM
    account
WHERE 
    account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors".
UPDATE 
    inventory
SET
    inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE
    inv_make = 'GM' AND inv_model = 'Hummer';

-- Use an inner join to select the make and model fields from the inventory table
-- and the classification name field from the classification table for inventory items
-- that belong to the "Sport" category
SELECT
    inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM
    inventory
INNER JOIN
    classification ON inventory.classification_id = classification.classification_id
WHERE
    classification.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file path
UPDATE
    inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');




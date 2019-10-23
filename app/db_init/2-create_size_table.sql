CREATE TABLE size_data (
id serial PRIMARY KEY,
shoe_model INTEGER NOT NULL,
size INTEGER NOT NULL,
CONSTRAINT shoe_model_size_data_fk FOREIGN KEY (shoe_model)
    REFERENCES shoes (id) ON DELETE NO ACTION
);
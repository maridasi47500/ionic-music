import "reflect-metadata"
import { DataSource } from "typeorm"
import { Song } from "./entity/song"

const AppDataSource = new DataSource({
	    type: "sqlite",
			        database: "test",
				    entities: [Song],
				        synchronize: true,
					    logging: false,
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {
            // here you can start to work with your database
                })
                    .catch((error) => console.log(error))

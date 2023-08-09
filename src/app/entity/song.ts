import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Song {
	    @PrimaryGeneratedColumn()
	    id: number

	        @Column()
	        title: string
		
		@Column()
	        artist: string

		@Column()
	        composer: string
		    
		    @Column("text")
		    description: string
		        
		        @Column()
		        filename: string
			 
			@Column()
		        image: string
			    
			    @Column("double")
			    views: number

			        @Column()
			        isPublished: boolean
}

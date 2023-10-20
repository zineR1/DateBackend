import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('Date','postgres', 'ale',{
    host: 'localhost',
    dialect: 'postgres'
})


/* {"access_token": "IGQWRNSjk3V1R3RGRVZAkZApa2R6bkE3ZA2JWeVN3dE5lQ0g2UWlYN0FPY0Q3MGJZAVUE1cEdKZAGxLYkVUU0cwek12NXVTWTNvRzRtVTlKdnNSN3NuS1BoRWtFX0Juai04X2NtbjhXamNzaHpvR0NRWWFEVzJkS01BUVZAxZAGRCSURXejZAOUQZDZD", "user_id": 5947555218680529} */

/* curl -X GET \
'https://graph.instagram.com/5947555218680529?fields=id,username&access_token=IGQWRNSjk3V1R3RGRVZAkZApa2R6bkE3ZA2JWeVN3dE5lQ0g2UWlYN0FPY0Q3MGJZAVUE1cEdKZAGxLYkVUU0cwek12NXVTWTNvRzRtVTlKdnNSN3NuS1BoRWtFX0Juai04X2NtbjhXamNzaHpvR0NRWWFEVzJkS01BUVZAxZAGRCSURXejZAOUQZDZD' */

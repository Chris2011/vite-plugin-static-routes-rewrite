# vite-plugin-static-routes-rewrite
## Rewrite static route in development mode (serve task)

When we want to develop a static site with for example vite, handlebars or something else, it could happen, that the URLs that we are calling inside of HTML, while development, are not the same URLs as for prod.

### Example
developmnt URL (before build): /leistungen  
prod URL (after build): /services.html  

For prod, you can use apache, nginx or whatever webserver you like.
For development we need this plugin for the vite dev server.

The idea came when I searched for it and found this ticket: 
So why a custom plugin and not the solution? I searched very very long for a solution and now here is a handy little plugin, everyone can handle it very easy by adding the plugin and adding the map with their URLS.
FROM tobi312/php:8.2-fpm-nginx-alpine

#make the artisan scheduler and cron running
RUN echo -e "\n* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1" >> /var/spool/cron/crontabs/root
RUN echo -e "[program:cron]\ncommand=crond -f\nautostart=true\nautorestart=true" >> /etc/supervisor.d/supervisord.ini

#change the nginx root directory
RUN sed -i 's|root /var/www/html;|root /var/www/html/public;|' /etc/nginx/conf.d/default.conf

# do some laravel specific config
RUN sed -i 's|try_files $uri $uri/ =404;|try_files $uri $uri/ /index.php?$query_string;|' /etc/nginx/conf.d/default.conf

ENV TZ "Europe/Berlin"
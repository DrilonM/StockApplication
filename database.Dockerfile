FROM busybox:1.35-uclibc

WORKDIR /app/database

COPY ./database/stock_data.db ./stock_data.db

RUN ls -l /app/database/stock_data.db


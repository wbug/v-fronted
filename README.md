# v-fronted
fronted for vpn 


使用 
yarn install   

yarn run webpack


然后用nginx 来使用网页：

	server {
        listen       8097;
        server_name  localhost;
		root E:/web3pioneer/code/v-fronted;
		
		location / {
            index  index.html index.htm;
        }
		
	}

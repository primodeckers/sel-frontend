# # defina a imagem base 
# para produção, o nó é usado apenas para criar 
# os arquivos estáticos de Html e javascript 
# como o react cria arquivos estáticos de html e js após a compilação 
# estes são o que será servido pelo nginx 
# use alias build para ser mais fácil consultar esse contêiner em outro lugar 
# por exemplo, dentro do contêiner nginx 
FROM node:alpine as build
# definir diretório de trabalho 
# é a pasta de trabalho no contêiner 
# do qual o aplicativo será executado a partir do 
WORKDIR /app
# copie tudo para /app No diretório 
#, ao contrário do dev, no prod, tudo é copiado para o docker 
COPY . /app
# adicione a pasta node_modules a $ PATH 
ENV PATH /app/node_modules/.bin:$PATH
# dependências de instalação e cache 
RUN yarn config set proxy http://proxy.presidencia.gov.br:8080 && yarn config set strict-ssl false && yarn
#build do projeto para produção
RUN yarn build

# configure ambiente de produção 
# a imagem base é uma imagem nginx baseada em alpine 
FROM nginx:alpine
# copie a pasta build de reaja à raiz do nginx ( www) 
COPY --from=build /app/build /usr/share/nginx/html
# --------- apenas para aqueles que usam o react router ---------- 
# se você estiver usando o react router 
#, você precisa sobrescrever as configurações padrão do nginx 
# remover o arquivo de configuração padrão do nginx 
RUN rm /etc/nginx/conf.d/default.conf
# substituir pelo personalizado 
COPY nginx.conf /etc/nginx/conf.d
# --------- / somente para aqueles que usam o react router ---------- 
# exponha a porta 80 ao mundo exterior 
EXPOSE 80
# start nginx 
CMD ["nginx", "-g", "daemon off;"]
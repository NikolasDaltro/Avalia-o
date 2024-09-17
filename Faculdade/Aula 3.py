#For sabemos que ele irá rodar a lista de 1 a 5
numeros = {1, 2, 3 , 4, 5}

#for num in numeros:
 #print(num)

 #while não sabemos onde vai parar
#numero = int(input("Digite um numero (ou 0 para Sair): "))

#while numero != 0:
 #   if numero % 2 == 0:
  #      print("O numero é par")
   # else:
        #print("O número é impar.")
        #numero = int(input("Digite um numero (ou 0 para Sair):"))

    #Trabalhando com range
#for x in range(5): #campo começa com 0.
       # print(x)

#for y in range(2,7): #o 7 não entra no looping
 #   print(y)

#for z in range(1, 11, 2): #o looping vai de 1 a 11 e pula de 2 em dois porem o 11 não aparece
 #   print(z)

 #Pare ou continue
 #o brak irá trazer o numero mais proxima entre 3 e 11

#for numero in range(3,11):
    #if numero % 2 == 0:
        #print("O primeiro numero par é", numero)
       # break

for numero in range(1,11):
    if numero  == 5:
      continue
    print(numero)
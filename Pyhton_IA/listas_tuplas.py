#lista_frutas = ['banana','maçã','limão','abacaxi','tangerina','mamão']
#frutas_tupladas = tuple(lista_frutas)
#print(frutas_tupladas)

minhas_frutas = []

for item in range(6): 
  fruta_favorita = input("Qual sua fruta favorita?\n") 
  minhas_frutas.append(fruta_favorita)
  
    
lista_tuplada = tuple(minhas_frutas)

print(f"As suas frutas favoritas são: {lista_tuplada}")

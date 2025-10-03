import time
lista_de_compras = {

}
valor_total = 0 
for prod in range(5):
    nome_produto = input("Informe o nome do produto: ")
    preco_produto = float(input("Informe o preço do produto: "))
    print('')
    lista_de_compras[nome_produto] = preco_produto 
print("Produtos adicionados com sucesso! ")

print("Calculadno o valor total da compra...")
time.sleep(0.3)

for prod in lista_de_compras.values():
    valor_total += prod
print(f"O valor total da sua compra foi: {valor_total:.2f}")

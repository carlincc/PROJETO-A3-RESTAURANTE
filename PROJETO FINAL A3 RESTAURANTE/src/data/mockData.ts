
import { Restaurante, Produto, FormaPagamento, Usuario, Cozinha, Avaliacao } from '../types';

export const cozinhas: Cozinha[] = [
  { id: 1, nome: 'Brasileira' },
  { id: 2, nome: 'Italiana' },
  { id: 3, nome: 'Japonesa' },
  { id: 4, nome: 'Mexicana' },
  { id: 5, nome: 'Americana' },
  { id: 6, nome: 'Chinesa' },
  { id: 7, nome: 'Indiana' },
  { id: 8, nome: 'Árabe' },
  { id: 9, nome: 'Francesa' },
  { id: 10, nome: 'Vegetariana' }
];

export const restaurantes: Restaurante[] = [
  {
    id: 1,
    nome: 'Komi Keto',
    taxaFrete: 5.99,
    ativo: true,
    aberto: true,
    dataCadastro: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-06-15'),
    cozinha: cozinhas[0],
    endereco: {
      id: 1,
      cep: '01234-567',
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: { id: 1, nome: 'São Paulo' },
      estado: { id: 1, nome: 'SP' }
    },
    avaliacoes: 4.8,
    tempoEntrega: '20-30 min',
    descricao: 'Culinária brasileira com pratos saudáveis e saborosos',
    telefone: '(11) 3456-7890'
  },
  {
    id: 2,
    nome: 'Pizza Express',
    taxaFrete: 4.99,
    ativo: true,
    aberto: true,
    dataCadastro: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-06-15'),
    cozinha: cozinhas[1],
    endereco: {
      id: 2,
      cep: '01234-568',
      logradouro: 'Av. Paulista',
      numero: '456',
      bairro: 'Bela Vista',
      cidade: { id: 1, nome: 'São Paulo' },
      estado: { id: 1, nome: 'SP' }
    },
    avaliacoes: 4.5,
    tempoEntrega: '25-35 min',
    descricao: 'As melhores pizzas artesanais da cidade',
    telefone: '(11) 2345-6789'
  },
  {
    id: 3,
    nome: 'Sushi House',
    taxaFrete: 7.99,
    ativo: true,
    aberto: true,
    dataCadastro: new Date('2024-02-01'),
    dataAtualizacao: new Date('2024-06-15'),
    cozinha: cozinhas[2],
    endereco: {
      id: 3,
      cep: '01234-569',
      logradouro: 'Rua da Liberdade',
      numero: '789',
      bairro: 'Liberdade',
      cidade: { id: 1, nome: 'São Paulo' },
      estado: { id: 1, nome: 'SP' }
    },
    avaliacoes: 4.9,
    tempoEntrega: '30-40 min',
    descricao: 'Culinária japonesa autêntica com ingredientes frescos',
    telefone: '(11) 1234-5678'
  }
];

export const produtos: Produto[] = [
  // Pizzas - Pizza Express
  {
    id: 1,
    nome: 'Pizza Margherita',
    descricao: 'Molho de tomate artesanal, mussarela de búfala, manjericão fresco e azeite extravirgem',
    preco: 29.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=200&fit=crop',
    restaurante: restaurantes[1],
    categoria: 'Pizza'
  },
  {
    id: 2,
    nome: 'Pizza Pepperoni',
    descricao: 'Molho de tomate temperado, mussarela especial e pepperoni importado',
    preco: 34.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
    restaurante: restaurantes[1],
    categoria: 'Pizza'
  },
  {
    id: 3,
    nome: 'Pizza Quattro Stagioni',
    descricao: 'Molho de tomate, mussarela, presunto parma, cogumelos frescos, azeitonas pretas e alcachofras',
    preco: 38.90,
    ativo: true,
    foto: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A7B9D1B2-20CE-4D60-B18D-77D8E09F847A/Derivates/349C6F0F-E5E5-4327-9892-930DE2D8E89F.jpg',
    restaurante: restaurantes[1],
    categoria: 'Pizza'
  },
  
  // Hambúrgueres - Komi Keto
  {
    id: 4,
    nome: 'Burger Clássico',
    descricao: 'Pão brioche artesanal, hambúrguer 180g, queijo cheddar, alface americana, tomate e cebola roxa',
    preco: 24.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    restaurante: restaurantes[0],
    categoria: 'Hambúrguer'
  },
  {
    id: 5,
    nome: 'Burger Bacon',
    descricao: 'Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante artesanal e molho especial da casa',
    preco: 28.90,
    ativo: true,
    foto: 'https://cloudfront-us-east-1.images.arcpublishing.com/estadao/L3LYN5Y4MRG6BB47MNHEEXDRGA.jpeg',
    restaurante: restaurantes[0],
    categoria: 'Hambúrguer'
  },
  {
    id: 6,
    nome: 'Burger Vegano',
    descricao: 'Pão integral sem glúten, hambúrguer de grão-de-bico e quinoa, queijo vegano, rúcula e tomate seco',
    preco: 26.90,
    ativo: true,
    foto: 'https://www.sabornamesa.com.br/media/k2/items/cache/acbf17dca076404b2078b0d4b135530d_L.jpg',
    restaurante: restaurantes[0],
    categoria: 'Hambúrguer'
  },
  
  // Sushi - Sushi House
  {
    id: 7,
    nome: 'Combo Sashimi',
    descricao: 'Seleção premium: 6 fatias de salmão, 6 de atum e 6 de peixe branco frescos',
    preco: 45.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
    restaurante: restaurantes[2],
    categoria: 'Sushi'
  },
  {
    id: 8,
    nome: 'Hot Roll Philadelphia',
    descricao: 'Salmão, cream cheese, cebolinha, envolvido em massa tempurá crocante',
    preco: 32.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
    restaurante: restaurantes[2],
    categoria: 'Sushi'
  },
  {
    id: 9,
    nome: 'Temaki Salmão',
    descricao: 'Cone de alga nori, arroz temperado, salmão fresco, pepino e gergelim',
    preco: 18.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=300&h=200&fit=crop',
    restaurante: restaurantes[2],
    categoria: 'Sushi'
  },
  
  // Bebidas
  {
    id: 10,
    nome: 'Coca-Cola Lata',
    descricao: 'Refrigerante de cola gelado 350ml',
    preco: 5.90,
    ativo: true,
    foto: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/119765719/coca-cola-lata-350-ml-1.jpg?v=638224488171270000',
    restaurante: restaurantes[0],
    categoria: 'Bebidas'
  },
  {
    id: 11,
    nome: 'Suco de Laranja Natural',
    descricao: 'Suco natural de laranja lima, sem açúcar adicionado - 500ml',
    preco: 8.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop',
    restaurante: restaurantes[0],
    categoria: 'Bebidas'
  },
  {
    id: 12,
    nome: 'Água Mineral',
    descricao: 'Água mineral natural sem gás - 500ml',
    preco: 3.90,
    ativo: true,
    foto: 'https://prezunic.vtexassets.com/arquivos/ids/181626-800-auto?v=638368814725070000&width=800&height=auto&aspect=true',
    restaurante: restaurantes[0],
    categoria: 'Bebidas'
  },
  
  // Sobremesas
  {
    id: 13,
    nome: 'Tiramisù',
    descricao: 'Sobremesa italiana clássica com café, mascarpone e cacau em pó',
    preco: 16.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
    restaurante: restaurantes[1],
    categoria: 'Sobremesas'
  },
  {
    id: 14,
    nome: 'Brownie com Sorvete',
    descricao: 'Brownie de chocolate belga quente com sorvete de baunilha e calda de chocolate',
    preco: 14.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
    restaurante: restaurantes[0],
    categoria: 'Sobremesas'
  },
  {
    id: 15,
    nome: 'Mochi de Morango',
    descricao: 'Doce japonês tradicional de arroz com recheio cremoso de morango - 4 unidades',
    preco: 19.90,
    ativo: true,
    foto: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=300&h=200&fit=crop',
    restaurante: restaurantes[2],
    categoria: 'Sobremesas'
  }
];

export const formasPagamento: FormaPagamento[] = [
  { id: 1, descricao: 'Cartão de Crédito' },
  { id: 2, descricao: 'Cartão de Débito' },
  { id: 3, descricao: 'PIX' },
  { id: 4, descricao: 'Dinheiro' },
  { id: 5, descricao: 'Vale Refeição' },
  { id: 6, descricao: 'Vale Alimentação' }
];

export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: '123456',
    dataCadastro: new Date('2024-01-10'),
    tipo: 'cliente'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    senha: '123456',
    dataCadastro: new Date('2024-02-15'),
    tipo: 'cliente'
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    email: 'pedro@email.com',
    senha: '123456',
    dataCadastro: new Date('2024-03-20'),
    tipo: 'cliente'
  }
];

export const avaliacoes: Avaliacao[] = [
  {
    id: 1,
    nota: 5,
    comentario: 'Pizza excelente! Ingredientes frescos e entrega rápida. Recomendo muito!',
    dataCriacao: new Date('2024-06-15'),
    usuario: usuarios[0],
    produto: produtos[0]
  },
  {
    id: 2,
    nota: 4,
    comentario: 'Muito boa, mas poderia ter mais pepperoni. No geral, recomendo.',
    dataCriacao: new Date('2024-06-10'),
    usuario: usuarios[1],
    produto: produtos[1]
  },
  {
    id: 3,
    nota: 5,
    comentario: 'Hambúrguer delicioso, bem temperado e suculento! Voltarei sempre.',
    dataCriacao: new Date('2024-06-12'),
    usuario: usuarios[0],
    produto: produtos[3]
  },
  {
    id: 4,
    nota: 5,
    comentario: 'Sashimi fresco e de qualidade excepcional. Melhor sushi da região!',
    dataCriacao: new Date('2024-06-14'),
    usuario: usuarios[2],
    produto: produtos[6]
  },
  {
    id: 5,
    nota: 4,
    comentario: 'Hot roll muito saboroso, massa crocante perfeita.',
    dataCriacao: new Date('2024-06-13'),
    usuario: usuarios[1],
    produto: produtos[7]
  },
  {
    id: 6,
    nota: 5,
    comentario: 'Restaurante Komi Keto é incrível! Ambiente acolhedor e comida excepcional.',
    dataCriacao: new Date('2024-06-11'),
    usuario: usuarios[0],
    restaurante: restaurantes[0]
  },
  {
    id: 7,
    nota: 4,
    comentario: 'Pizza Express sempre entrega qualidade. Pizzas saborosas e bom atendimento.',
    dataCriacao: new Date('2024-06-09'),
    usuario: usuarios[2],
    restaurante: restaurantes[1]
  },
  {
    id: 8,
    nota: 5,
    comentario: 'Sushi House é referência! Produtos frescos e apresentação impecável.',
    dataCriacao: new Date('2024-06-08'),
    usuario: usuarios[1],
    restaurante: restaurantes[2]
  }
];


export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  dataCadastro: Date;
  tipo: 'cliente' | 'gerente' | 'admin';
}

export interface Restaurante {
  id: number;
  nome: string;
  taxaFrete: number;
  ativo: boolean;
  aberto: boolean;
  dataCadastro: Date;
  dataAtualizacao: Date;
  cozinha: Cozinha;
  endereco: Endereco;
  avaliacoes: number;
  tempoEntrega: string;
  descricao?: string;
  telefone?: string;
}

export interface Cozinha {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  foto: string;
  restaurante: Restaurante;
  categoria: string;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  dataCriacao: Date;
  usuario: Usuario;
  produto?: Produto;
  restaurante?: Restaurante;
  pedido?: Pedido;
}

export interface Pedido {
  id: number;
  codigo: string;
  desconto: number;
  taxaFrete: number;
  valorTotal: number;
  dataCriacao: Date;
  dataConfirmacao?: Date;
  dataEntrega?: Date;
  dataCancelamento?: Date;
  status: StatusPedido;
  categoria: CategoriaPedido;
  usuario: Usuario;
  restaurante: Restaurante;
  formaPagamento: FormaPagamento;
  endereco: Endereco;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  observacao?: string;
  produto: Produto;
}

export interface FormaPagamento {
  id: number;
  descricao: string;
}

export interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: Cidade;
  estado: Estado;
}

export interface Cidade {
  id: number;
  nome: string;
}

export interface Estado {
  id: number;
  nome: string;
}

export enum StatusPedido {
  CRIADO = 'CRIADO',
  CONFIRMADO = 'CONFIRMADO',
  EM_PREPARO = 'EM_PREPARO',
  SAIU_PARA_ENTREGA = 'SAIU_PARA_ENTREGA',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

export enum CategoriaPedido {
  DELIVERY = 'DELIVERY',
  RETIRADA = 'RETIRADA',
  BALCAO = 'BALCAO'
}

export interface CartItem {
  produto: Produto;
  quantidade: number;
  observacao?: string;
}

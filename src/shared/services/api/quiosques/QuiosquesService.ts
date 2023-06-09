import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IListagemQuiosque {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
}

export interface IDetalheQuiosque {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
}

type TQuiosquesComTotalCount = {
  data: IListagemQuiosque[];
  totalCount: number;
}

const getAll = async ( page = 1, filter = ''): Promise<TQuiosquesComTotalCount | Error> => {
  try {
    const urlRelativa = `/quiosque?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    let { data, headers } = await  Api.get(urlRelativa);

    if (data) {
      let final = Environment.LIMITE_DE_LINHAS * page;
      let inicial = final - Environment.LIMITE_DE_LINHAS;
      let length = data.length;
      data = data.slice(inicial, final);
      return {
        data,
        totalCount: length,
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
 };

 const getTotal = async (): Promise<number | Error> => {
  try {
    const { data } = await  Api.get(`/quiosque/contar`);

    if (data) {
      return data;
    }
    
    return new Error('Erro ao contar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao contar os registros.');
  }
 };

const getById = async (id: number): Promise<IDetalheQuiosque | Error> => {
  try {
    const { data } = await  Api.get(`/quiosque/${id}`);

    if (data) {
      return data;
    }
    
    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
 };

const create = async (dados: Omit<IDetalheQuiosque, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await  Api.post<IDetalheQuiosque>('/quiosque', dados);

    if (data) {
      return data.id;
    }
    
    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
 };

const updateById = async (id: number, dados: IDetalheQuiosque): Promise<void | Error> => {
  try {
    await  Api.put(`/quiosque/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
 };

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await  Api.delete(`/quiosque/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
 };

export const QuiosquesService = {
  getAll,
  getTotal,
  getById,
  create,
  updateById,
  deleteById,
};
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { QuiosquesService } from "../../shared/services/api/quiosques/QuiosquesService";
import { VTextField } from "../../shared/forms";

interface IFormData {
  nome: string;
  endereco: string;
  cidade: string;
}


export const DetalheDeQuiosques: React.FC = () => {
  const { id = 'novo'} = useParams<'id'>();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      QuiosquesService.getById(Number(id))
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate('/quiosques');
        } else {
          setNome(result.nome);
          formRef.current?.setData(result);
        }
      });
    }

  }, [id]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);

    if (id === 'novo') {
      QuiosquesService
      .create(dados)
      .then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          navigate(`/quiosques/detalhe/${result}`);
        }
      });
    } else {
      QuiosquesService
      .updateById(Number(id), { id: Number(id), ...dados })
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Deseja realmente apagar o registro?')) {
      QuiosquesService.deleteById(id)
      .then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro apagado com sucesso!');
          navigate('/quiosques');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'novo' ? 'Novo quiosque' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe 
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'novo'}
          mostrarBotaoNovo={id !== 'novo'}

          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/quiosques/detalhe/novo')}
          aoClicarEmVoltar={() => navigate('/quiosques')}
        />
      }
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <VTextField placeholder="Nome" name="nome" />
        <VTextField placeholder="Endereço" name="endereco" />
        <VTextField placeholder="Cidade" name="cidade" />
      </Form>
    </LayoutBaseDePagina>
  );
};
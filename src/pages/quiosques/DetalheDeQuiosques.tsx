import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { QuiosquesService } from "../../shared/services/api/quiosques/QuiosquesService";


export const DetalheDeQuiosques: React.FC = () => {
  const { id = 'novo'} = useParams<'id'>();
  const navigate = useNavigate();

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
          console.log(result);
        }
      });
    }

  }, [id]);

  const handleSave = () => {
    console.log('Save');
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

          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/quiosques/detalhe/novo')}
          aoClicarEmVoltar={() => navigate('/quiosques')}
        />
      }
    >
      
      {isLoading && (
        <CircularProgress color="info" />
      )}

      <p>DetalheDeQuiosques {id} </p>
    </LayoutBaseDePagina>
  );
};
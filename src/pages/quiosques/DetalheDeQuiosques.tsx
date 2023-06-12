import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";


export const DetalheDeQuiosques: React.FC = () => {
  const { id = 'novo'} = useParams<'id'>();
  const navigate = useNavigate();

  const handleSave = () => {
    console.log('Save');
  };

  const handleDelete = () => {
    console.log('Delete');
  };

  return (
    <LayoutBaseDePagina
      titulo="Detalhe do quiosque"
      barraDeFerramentas={
        <FerramentasDeDetalhe 
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'novo'}
          mostrarBotaoNovo={id !== 'novo'}

          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmApagar={handleDelete}
          aoClicarEmNovo={() => navigate('/quiosques/detalhe/novo')}
          aoClicarEmVoltar={() => navigate('/quiosques')}
        />
      }
    >
      <p>DetalheDeQuiosques {id} </p>
    </LayoutBaseDePagina>
  );
};
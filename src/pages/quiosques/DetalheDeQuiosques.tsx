import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { QuiosquesService } from "../../shared/services/api/quiosques/QuiosquesService";
import { VTextField, VForm, useVForm } from "../../shared/forms";
interface IFormData {
  nome: string;
  endereco: string;
  cidade: string;
}

export const DetalheDeQuiosques: React.FC = () => {
  const { id = 'novo'} = useParams<'id'>();
  const navigate = useNavigate();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();


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
    } else {
      formRef.current?.setData({
        nome: '',
        endereco: '',
        cidade: '',
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
          if (isSaveAndClose()) {
            navigate('/quiosques');
          } else {
            navigate(`/quiosques/detalhe/${result}`);
          }
        }
      });
    } else {
      QuiosquesService
      .updateById(Number(id), { id: Number(id), ...dados })
      .then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          if (isSaveAndClose()) {
            navigate('/quiosques');
          }
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

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/quiosques/detalhe/novo')}
          aoClicarEmVoltar={() => navigate('/quiosques')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant="outlined">

          <Grid container direction='column' padding={2} spacing={2}>

            {isLoading && (
              <Grid item textAlign='center'>
                <CircularProgress color="info" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="nome"
                  label="Nome"
                  disabled={isLoading}
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="endereco"
                  label="Endereço"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="cidade"
                  label="Cidade"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
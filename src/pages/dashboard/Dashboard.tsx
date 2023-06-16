import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { QuiosquesService } from "../../shared/services/api/quiosques/QuiosquesService";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Dashboard = () => {
  const [isLoadingQuiosques, setIsLoadingQuiosques] = useState(true);
  const [totalCountQuiosques, setTotalCountQuiosques] = useState(0);

  useEffect(() => {
    setIsLoadingQuiosques(true);
      QuiosquesService.getAll(1)
        .then((result) => {
          setIsLoadingQuiosques(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setTotalCountQuiosques(result.totalCount);
          }
        });
  }, []);

  return (
    <LayoutBaseDePagina
      titulo="Página inicial"
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Quiosques
                  </Typography>
                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingQuiosques && (
                      <Typography variant="h1">
                        {totalCountQuiosques}
                      </Typography>
                    )}
                    {isLoadingQuiosques && (
                      <Typography variant="h6">
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
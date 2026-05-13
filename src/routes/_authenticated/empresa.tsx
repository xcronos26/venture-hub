import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { empresaService } from "@/services/empresa.service";

export const Route = createFileRoute("/_authenticated/empresa")({ component: EmpresaPage });

function EmpresaPage() {
  const { data, isLoading } = useQuery({ queryKey: ["empresa"], queryFn: () => empresaService.get() });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Perfil da Empresa</h1>
        <p className="text-muted-foreground">Dados cadastrais e descrição.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{isLoading ? <Skeleton className="h-6 w-48" /> : data?.razaoSocial}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <>
              <p><strong>CNPJ:</strong> {data?.cnpj}</p>
              <p><strong>Nome fantasia:</strong> {data?.nomeFantasia}</p>
              <p><strong>Ramo:</strong> {data?.ramo}</p>
              <p><strong>Público:</strong> {data?.publico}</p>
              <p><strong>Descrição:</strong> {data?.descricao}</p>
              <p><strong>Diferencial:</strong> {data?.diferencial}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

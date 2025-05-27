import React from 'react'

import {
  Search,
  AlertCircle,
} from "lucide-react";

import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';

const Error404 = () => {
  return (
    <div className='w-full'>
        <Card className='p-4'>
            <CardContent>
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="rounded-lg bg-gray-100 border border-blue-200 p-4 w-full">
                        <AlertCircle className="h-6 w-6 text-yellow-400" />
                        <div className='pt-4 pb-2 text-xl font-semibold'>
                            Sin resultados
                        </div>
                        <div className='text-base'>
                            El ID de ciudad ingresado no existe en nuestro sistema. Por favor, verifica el código e intenta nuevamente.
                        </div>

                        <div className='flex flex-col items-center justify-center pt-6'>
                            <Search className="h-12 w-12 text-muted-foreground " />
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    No hay coincidencias
                                    </h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Verifica que los datos ingresados sean correctos o intenta con diferentes valores.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default Error404

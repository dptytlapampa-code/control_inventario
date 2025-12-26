<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExportacionesController extends Controller
{
    public function exportEquipos(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportMantenimientos(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportHistorial(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportActas(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportUsuarios(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportAuditoria(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportOficinas(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportServicios(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportHospitales(Request $request)
    {
        return $this->notImplemented();
    }

    public function exportTiposEquipos(Request $request)
    {
        return $this->notImplemented();
    }

    private function notImplemented()
    {
        return response()->json([
            'message' => 'Exportaciones no están habilitadas en esta fase.'
        ], Response::HTTP_NOT_IMPLEMENTED);
    }
}

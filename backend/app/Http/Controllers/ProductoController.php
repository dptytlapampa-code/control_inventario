<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $busqueda = $request->get('q');
        $query = Producto::query();
        if ($busqueda) {
            $query->where('nombre', 'like', "%{$busqueda}%")
                ->orWhere('codigo', 'like', "%{$busqueda}%");
        }

        return response()->json([
            'data' => $query->orderBy('nombre')->limit(50)->get(),
        ]);
    }
}

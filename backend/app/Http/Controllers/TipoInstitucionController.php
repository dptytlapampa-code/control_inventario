<?php

namespace App\Http\Controllers;

use App\Models\TipoInstitucion;
use Illuminate\Support\Str;
use App\Http\Resources\TipoInstitucionResource;
use App\Http\Requests\StoreTipoInstitucionRequest;
use App\Http\Requests\UpdateTipoInstitucionRequest;

class TipoInstitucionController extends Controller
{
    public function index()
    {
        return TipoInstitucionResource::collection(
            TipoInstitucion::orderBy('nombre')->get()
        );
    }

    public function store(StoreTipoInstitucionRequest $request)
    {
        $data = $request->validated();
        $data['id'] = Str::uuid();

        $tipo = TipoInstitucion::create($data);

        return new TipoInstitucionResource($tipo);
    }

    public function show($id)
    {
        $tipo = TipoInstitucion::findOrFail($id);
        return new TipoInstitucionResource($tipo);
    }

    public function update(UpdateTipoInstitucionRequest $request, $id)
    {
        $tipo = TipoInstitucion::findOrFail($id);
        $tipo->update($request->validated());

        return new TipoInstitucionResource($tipo);
    }

    public function destroy($id)
    {
        $tipo = TipoInstitucion::findOrFail($id);

        if ($tipo->instituciones()->exists()) {
            return response()->json([
                'error' => 'No se puede eliminar este tipo porque tiene instituciones asociadas.'
            ], 409);
        }

        $tipo->delete();

        return response()->json(null, 204);
    }
}

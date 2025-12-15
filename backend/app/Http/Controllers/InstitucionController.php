<?php

namespace App\Http\Controllers;

use App\Models\Institucion;
use Illuminate\Support\Str;
use App\Http\Requests\StoreInstitucionRequest;
use App\Http\Requests\UpdateInstitucionRequest;
use App\Http\Resources\InstitucionResource;

class InstitucionController extends Controller
{
    public function index()
    {
        return InstitucionResource::collection(
            Institucion::with('tipo')->orderBy('nombre')->get()
        );
    }

    public function store(StoreInstitucionRequest $request)
    {
        $data = $request->validated();
        $data['id'] = Str::uuid();

        $institucion = Institucion::create($data);

        return new InstitucionResource($institucion);
    }

    public function show($id)
    {
        return new InstitucionResource(
            Institucion::with('tipo')->findOrFail($id)
        );
    }

    public function update(UpdateInstitucionRequest $request, $id)
    {
        $institucion = Institucion::findOrFail($id);
        $institucion->update($request->validated());

        return new InstitucionResource($institucion);
    }

    public function destroy($id)
    {
        $institucion = Institucion::findOrFail($id);

        if ($institucion->unidades()->exists()) {
            return response()->json([
                'error' => 'No se puede eliminar la institución porque tiene unidades asociadas.'
            ], 409);
        }

        $institucion->delete();

        return response()->json(null, 204);
    }
}

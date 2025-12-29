<?php

namespace Maatwebsite\Excel;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromArray;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelManager
{
    public function download(FromArray $export, string $fileName, string $writerType = 'csv', array $headers = []): StreamedResponse
    {
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $resolvedExtension = $extension ?: Str::lower($writerType ?: 'csv');
        $safeName = $extension ? $fileName : $fileName . '.' . $resolvedExtension;

        $headers = array_merge([
            'Content-Type' => $this->contentTypeFor($resolvedExtension),
            'Content-Disposition' => 'attachment; filename="' . $safeName . '"',
        ], $headers);

        $rows = $this->normalizeRows($export->array());

        return response()->stream(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, 200, $headers);
    }

    private function normalizeRows(array $rows): array
    {
        return array_map(function ($row) {
            if ($row instanceof Collection) {
                return $row->toArray();
            }

            if (is_array($row)) {
                return array_map(fn ($value) => is_scalar($value) ? $value : json_encode($value), $row);
            }

            return [$row];
        }, $rows);
    }

    private function contentTypeFor(string $extension): string
    {
        return match (Str::lower($extension)) {
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls' => 'application/vnd.ms-excel',
            default => 'text/csv',
        };
    }
}

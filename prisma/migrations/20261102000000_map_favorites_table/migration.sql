DO $$
BEGIN
  IF to_regclass('public.favorites') IS NULL
     AND to_regclass('public."Favorite"') IS NOT NULL THEN
    ALTER TABLE public."Favorite" RENAME TO favorites;
  ELSIF to_regclass('public.favorites') IS NULL
        AND to_regclass('public."Favorite"') IS NULL THEN
    RAISE EXCEPTION 'Neither public.favorites nor public."Favorite" exists.';
  ELSIF to_regclass('public.favorites') IS NOT NULL
        AND to_regclass('public."Favorite"') IS NOT NULL THEN
    RAISE EXCEPTION 'Both public.favorites and public."Favorite" exist; reconcile favorite records before migration.';
  END IF;
END
$$;

#!/bin/bash
eval $(minikube -p minikube docker-env)

echo "🛠️ Rebuilding API images..."

docker build -t bazaar-email ./api-templates/email-api
docker build -t bazaar-notification ./api-templates/notification-api
docker build -t bazaar-currency ./api-templates/currency-api
docker build -t bazaar-payment ./api-templates/payment-api
docker build -t bazaar-gst ./api-templates/gst-api
docker build -t bazaar-finance ./api-templates/finance-api

echo "🚀 Restarting deployments..."
kubectl rollout restart deployment email-deployment
kubectl rollout restart deployment notification-deployment
kubectl rollout restart deployment currency-deployment
kubectl rollout restart deployment payment-deployment
kubectl rollout restart deployment gst-deployment
kubectl rollout restart deployment finance-deployment

echo "✅ Done!"
